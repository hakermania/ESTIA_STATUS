#!/bin/bash

# IPs

A=("a.txt" "150.140.210.126")
B=("b.txt" "150.140.211.126")
C=("c.txt" "150.140.212.126")

Z=("z.txt" "150.140.215.126")
H=("h.txt" "150.140.216.126")
TH=("th.txt" "150.140.217.126")

OM=("om.txt" "150.140.208.66")
THL=("thl.txt" "150.140.208.65")

# ping time

pingTime=5m

# output directories

finalOutputDirectory="/var/www/status/"
tempOutputDirectory="/tmp/serverStatus/"

mkdir -p $tempOutputDirectory
mkdir -p $finalOutputDirectory

while true; do

	# Ping all the servers for 5 minutes

	pingProcessIDs=()

	for inotar in "${A[*]}" "${B[*]}" "${C[*]}" "${Z[*]}" "${H[*]}" "${TH[*]}" "${OM[*]}" "${THL[*]}"; do
		i=($inotar)
		ping -q ${i[1]} > ${tempOutputDirectory}${i[0]}&
		pingProcessIDs+=($!)
	done

	sleep $pingTime

	for pingID in "${pingProcessIDs[@]}"; do
		kill -s SIGINT ${pingID}
	done

	for inotar in "${A[*]}" "${B[*]}" "${C[*]}" "${Z[*]}" "${H[*]}" "${TH[*]}" "${OM[*]}" "${THL[*]}"; do
		i=($inotar)
		percentage=$(cat ${tempOutputDirectory}${i[0]} | grep -oP '\d+(?=% packet loss)')
		echo $percentage > ${finalOutputDirectory}${i[0]}
	done

done
