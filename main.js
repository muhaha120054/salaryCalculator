function getRecordFromTxtFile(filePath){

    //read from txt file
    const fs = require('fs');
    let str = fs.readFileSync(filePath,'utf8');

    //distract elements
    //find valid seperators and turn them into hypen
    //charcode: 9 = tab, 32 = space ,13 = enter ,10 = nothing
    let tempString =[];
    for(let i =0;i<str.length;i++){
        let x = str.charCodeAt(i);
        if( x === 9 || x === 10 ||  x === 32){
            tempString += "-";
        } else if(x === 13){
        } else{
            tempString += str.charAt(i);
        }
    }
    //console.log(tempString);


    //correct elements
    //etc. if we found something like '\n31' or '<space>31', we take out the number 31;
    // 31(index number), \n(represent enter)
    let tempArray = tempString.split('-');
    let cleanSet = new Array();
    for(let i =0;i<tempArray.length;i++){
        for(let j =0;j<tempArray[i].length;j++){
            let a = parseInt(tempArray[i].substring(j));
            if(Number.isInteger(a)){
                cleanSet.push(tempArray[i].substring(j));
                break;
            }   
        }
    }
    
    //valid dataset. if format is wrong, send error msg.
    for(let i =1;i<cleanSet.length+1;i++){
        //console.log(cleanSet[i-1]);
        if(i%7 == 0 && cleanSet[i-1].length != 8){
            console.log('Error! turing .txt into readable data failed. Please check function() getRecordFromTxtFile')
            console.log('pleae check cleanSet[i]: ' + (i-1));
            break;

        }else if (i%7 === 6 && cleanSet[i-1].length != 10){
            console.log('Error! turing .txt into readable data failed. Please check function() getRecordFromTxtFile')
            console.log('pleae check cleanSet[i]: ' + (i-1));
            break;
        }
    }
    
    //push validated elements into record.
    //record[]: indexId, teacherId, YYYY, MM, DD, hh, mm
    let record = [];
    let index =0;
    for ( let i =0;i<(cleanSet.length/7);i++){
        for( let j =0;j< 7;j++)
        {
            if(j === 0){
                record[i] = new Array(7);
                record[i][j] = parseInt(cleanSet[index]);
                index += 2;
            } else if ( j === 1) {
                record[i][j] = parseInt(cleanSet[index]);
                index += 3;
            } else if ( j === 2){
                let splitDay = cleanSet[index].split('/');
                if(splitDay.length != 3) {
                    console.log('Error! Date format is incorrect. Please check cleanSet[i]' + index);
                    return;
                }
                record[i][j] = parseInt(splitDay[0]);
                record[i][j+1] = parseInt(splitDay[1]);
                record[i][j+2] = parseInt(splitDay[2]);
                index += 1;
            } else if ( j === 5) {
                let splitTime = cleanSet[index].split(':');
                if(splitTime.length != 3) {
                    console.log('Error! Time format is incorrect. Please check cleanSet[i]' + index);
                    return;
                }

                record[i][j] = parseInt(splitTime[0]);
                record[i][j+1] = parseInt(splitTime[1]);
                index += 1;
            }
        }
    }
    //console.log(record);
    return record;
    //test result
    /*
    for(let i =0;i<10;i++){
        console.log(record[i]);
    }
    */
}


function checkforInvalidRecords(
    {
        record: record,
        teacherId: teacherId,
        year: year,
        month: month //month as string
    }){
        let dayContainer = new Array(31);
        let invalidDays = new Array();


        for(let i=0;i<record.length;i++){
            //record[i][1] = teacherId , record[i][3] = month
            if(record[i][1] === teacherId && record[i][3] === parseInt(month)){
                //console.log(record[i]);
                if(dayContainer[record[i][4]] === undefined){
                    dayContainer[record[i][4]] = 1; 
                } else {
                    dayContainer[record[i][4]] += 1; 
                }
            }
                    }
        console.log('missing records on following days:')            
        for(let i =0;i<dayContainer.length;i++){
            if(dayContainer[i] !== undefined && dayContainer[i]% 2 !== 0){
                console.log('day' + (i) + ": " + dayContainer[i] + 'record(s)');
                invalidDays.push(i);
            }
        }
        console.log('Please insert clock-time by the following format:');
        console.log('addRecord(id,year,month,day,hour,minute)');
        console.log('Example: addRecord(2,2018,5,18,07,31)');

        for(let i =0;i<record.length;i++){
            for(let j = 0;j<invalidDays.length;j++){
                if(record[i][4] === invalidDays[j] && record[i][1] === teacherId && record[i][3] === parseInt(month)){
                    console.log(record[i]);
                }
            }
        }
    };

const year = '2018';
const month = '05';
const teacherId = 2;

const filePath = year + month + '.TXT';
//get plain records
const record = getRecordFromTxtFile(filePath);
checkforInvalidRecords(
    {
        record: record,
        teacherId: teacherId,
        year: year,
        month: month
    });
//console.log(record);

//addRecord();
//deleteRecord();
//display();
