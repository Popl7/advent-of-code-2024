#!/bin/bash

set -e

DAY=$1

if [ -z $DAY ]; then
  echo "Usage: mk_day.sh <day>"
  exit 1
fi

cp -R template/ $DAY/
sed -i '' "s/TEMPLATE/$DAY/g" $DAY/index.ts

cat <<EOF > main.ts
import { main } from "./$DAY/index.ts";

main();
EOF