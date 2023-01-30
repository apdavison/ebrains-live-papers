export GIT_COMMIT_SHA=`git rev-parse --short HEAD`
echo "export default {\"gitCommit\": \"$GIT_COMMIT_SHA\"}" > live-paper-builder/src/buildInfo.js