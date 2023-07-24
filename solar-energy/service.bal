//write a ballerina service that accept a body with a number and store that into a mongodb collection
//and return the id of the inserted document

import ballerina/http;
import ballerinax/mongodb;
import solarenergy.dto;
import ballerina/os;

service /solar\-energy on new http:Listener(9090) {
    
    private mongodb:ConnectionConfig conf = {
        connection: {
            url: os:getEnv("MONGO_URL")
        },
        databaseName: "SolarDB"
    };

    private mongodb:Client mongoClient;

    function init() returns error?{
        self.mongoClient = check new (self.conf);
    }
    resource function post generation\-stats(@http:Payload dto:GenerationStat genStat) returns string|error {
        string collection = "GenerationStats";
        json mp = genStat.toJson();
        lock {
            //map<json> doc = { "name": "Gmail", "version": "0.99.1", "type" : "Service" };
            if (mp is map<json>) {
                check self.mongoClient->insert(mp, collection);
            }
            
        }
        return genStat.pv;
    }

    resource function get generation\-stats() returns dto:GenerationStat[]|error {
        stream<dto:GenerationStat, error?>|mongodb:DatabaseError|mongodb:ApplicationError|error 
            find = self.mongoClient->find(collectionName = "GenerationStats", rowType = dto:GenerationStat);
        dto:GenerationStat[] stats = [];
        if find is stream<dto:GenerationStat, error?> {
            while true {
                record {|dto:GenerationStat value;|}|error? next = find.next();
                if next is map<dto:GenerationStat> {
                    stats.push(next.value);
                } else if next is error {
                    break;
                } else {
                    break;
                }
            }
        }
        if find is mongodb:DatabaseError {

        }
        if find is mongodb:ApplicationError {

        }
        return stats;
    }

}




