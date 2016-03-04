#!/usr/bin/python
import csv, json, pymongo

DEFAULT_INPUT_FILE = "./input.csv"
DEFAULT_OUTPUT_FILE = "./output.json";

inputfile = DEFAULT_INPUT_FILE
outputfile = DEFAULT_OUTPUT_FILE

print "Reading input file: outputfile"
csvreader = csv.reader(open(inputfile, 'rb'), delimiter=',', quotechar='"')
data = []
json_string = '['
currentstate = ""
for row in csvreader:
    print "reading row: " + str(row)

    if row[0] != currentstate:
        if currentstate == "":
            json_string = json_string + '{"State":"' + str(row[0]) + '","counties":['
        else:
            json_string = json_string + ']},{"State":"' + str(row[0]) + '","counties":['
        currentstate = row[0]
    else:
        json_string = json_string + ","

    json_string = json_string + '{"Name": "' + str(row[2]) + '"'
    json_string = json_string + ',"One Unit": ' + str(row[3])
    json_string = json_string + ',"Two Units": ' + str(row[4])
    json_string = json_string + ',"Three Units": ' + str(row[5])
    json_string = json_string + ',"Four Units": ' + str(row[6])

    json_string = json_string + "}"

json_string = json_string + ']}]'

print "Writing output to file: " + outputfile
open(outputfile, 'wb').write(json_string)