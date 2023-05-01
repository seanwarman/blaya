echo 'export const trackList = [' > $1
aws s3 ls --recursive everest-files/music/ | awk '/.mp3/ {print}' | awk 'BEGIN {FS=" "} {$1=$2=$3=null; $url=substr($0,4); gsub(/"/, "\\\x22", $url); print "\x09\x22" $url "\x22,"}' >> $1
echo ']' >> $1
