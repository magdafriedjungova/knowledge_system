import json
import csv

csvfile = open("test.json","w");
csvfile = open("flag.csv","r");

with open()

data = json.load(open('datasetMeta.json')) 

for row in data:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
#reader = json.reader( csvfile, fieldnames)

#reader = csv.DictReader( csvfile, fieldnames)
#for row in reader:
#    json.dump(row, jsonfile)
#    jsonfile.write('\n')