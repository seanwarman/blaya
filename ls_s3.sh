SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo 'export const trackList = [' > $SCRIPT_DIR/public/track-list.js
aws s3 ls --recursive everest-files/music/ | awk '/.mp3/ {print}' | awk 'BEGIN {FS=" "} {$1=$2=$3=null; $url=substr($0,4); gsub(/"/, "\\\x22", $url); print "\x09\x22" $url "\x22,"}' >> $SCRIPT_DIR/public/track-list.js
echo ']' >> $SCRIPT_DIR/public/track-list.js
