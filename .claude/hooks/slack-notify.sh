#!/bin/bash
# Slack 웹훅 알림 스크립트
# Claude Code hooks에서 호출되어 Slack으로 알림을 전송합니다.

# 환경 변수 로드 (프로젝트 로컬)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
fi

# 환경 변수 확인
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "Error: SLACK_WEBHOOK_URL이 설정되지 않았습니다." >&2
    echo ".claude/hooks/.env 파일에 SLACK_WEBHOOK_URL을 설정해주세요." >&2
    exit 0  # hook이 Claude 작업을 차단하지 않도록 0으로 종료
fi

WEBHOOK_URL="${SLACK_WEBHOOK_URL}"
EVENT_TYPE="$1"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
PROJECT_NAME=$(basename "$PROJECT_DIR")

# stdin에서 JSON 데이터 읽기
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "N/A"' 2>/dev/null)

# 이벤트 타입에 따른 메시지 설정
if [ "$EVENT_TYPE" = "permission" ]; then
    MESSAGE="🔐 *권한 요청*\\n프로젝트: \`$PROJECT_NAME\`\\n도구: \`$TOOL_NAME\`"
    COLOR="#ff9800"
elif [ "$EVENT_TYPE" = "stop" ]; then
    MESSAGE="✅ *작업 완료*\\n프로젝트: \`$PROJECT_NAME\`"
    COLOR="#4caf50"
else
    echo "Error: 알 수 없는 이벤트 타입: $EVENT_TYPE" >&2
    exit 0
fi

# Slack으로 메시지 전송
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"attachments\": [{
      \"color\": \"$COLOR\",
      \"text\": \"$MESSAGE\",
      \"mrkdwn_in\": [\"text\"]
    }]
  }" > /dev/null 2>&1

exit 0
