echo 'const trackList = [' > $1
aws s3 ls everest-files --recursive | awk 'BEGIN {FS=" "} {$1=$2=$3=null;$url=substr($0,4);print "\x09\x22" $url "\x22,"}' >> $1
echo ']' >> $1
