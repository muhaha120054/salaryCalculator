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
    let record = new Array();
    let index =0;
    for ( let i =0;i<(cleanSet.length/7);i++){
        for( let j =0;j< 7;j++)
        {
            if(j === 0){
                record[i] = new Array(7);
                record[i][j] = cleanSet[index];
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
    const recordObj = [];
    for(let i=0;i<record.length;i++){
        recordObj.push({
            indexLog: record[i][0],
            teacherId: record[i][1],
            year: record[i][2],
            month: record[i][3],
            day: record[i][4],
            hour: record[i][5],
            minute: record[i][6],
            hourUnit: record[i][5] + (record[i][6]/60)
        })

    }

    return recordObj;
    //test result
    /*
    for(let i =0;i<10;i++){
        console.log(record[i]);
    }
    */
}


function checkforInvalidRecords(recordObj,
    {
        teacherId: teacherId,
        year: year,
        month: month //month as string
    }){
        let dayContainer = new Array(31);
        let invalidDays = new Array();
        
        //count number of records into dayContainer
        for(let i=0;i<recordObj.length;i++){
            if(recordObj[i]){
                if(recordObj[i].teacherId === teacherId && recordObj[i].month === parseInt(month)){
                    if(dayContainer[recordObj[i].day] === undefined){
                        dayContainer[recordObj[i].day] = 1; 
                    } else {
                        dayContainer[recordObj[i].day] += 1; 
                    }
                }
            }
        }
        //display day of clock time that failed pairing.
        for(let i =0;i<dayContainer.length;i++){
            if(dayContainer[i] !== undefined && dayContainer[i]% 2 !== 0){
                console.log('day' + (i) + ": " + dayContainer[i] + 'record(s)');
                invalidDays.push(i);
            }
        }
        //console.log('Please insert clock-time by the following format:');
        //console.log('addRecord(id,year,month,day,hour,minute)');
        //console.log('Example: addRecord(2,2018,5,18,07,31)');
        //display records of clock tims that can't be pair
        for(let i =0;i<recordObj.length;i++){
            for(let j = 0;j<invalidDays.length;j++){
                if(recordObj[i].day === invalidDays[j] && recordObj[i].teacherId === teacherId && recordObj[i].month === parseInt(month)){
                    console.log('unpaired record: [indexLog]' + recordObj[i].indexLog + '[day]' + recordObj[i].day + '[Time]' + recordObj[i].hour + ':' + recordObj[i].minute ) ;
                }
            }
        }
        return dayContainer;
    };
function addRecord(recordObj,
    {
        indexLog,teacherId,year,month,day,hour,minute
    }){
    recordObj.push({indexLog,teacherId,year,month,day,hour,minute});
    let lastRecordIndex = (recordObj.length) -1;
    console.log('record added:' + recordObj[lastRecordIndex]);
};
function deleteRecord(recordObj, {
    indexLog
}){
    console.log('delete process being');
    console.log(recordObj.length);
    console.log(recordObj[2582].indexLog);

    for(let i = 0;i<recordObj.length;i++){
        if(recordObj[i].indexLog === indexLog) {
            console.log('deleted record:' + recordObj[i])
            delete recordObj[i];
        }
    }
};

function calculateSalary( {teacherId,year,month}, recordObj, dayContainer){
    month = parseInt(month);
    let dayRecord = new Array(31);
    //dayRecord[2].push(record[3]);
    for(let j=0;j<dayContainer.length;j++){
        if(dayContainer[j]) {
            for(let k=0;k<recordObj.length;k++){
                if(recordObj[k]) {
                    if(recordObj[k].teacherId === teacherId && recordObj[k].month === month && recordObj[k].day === j){
                        if(dayRecord[j] === undefined){
                            dayRecord[j] = new Array(3);
                            dayRecord[j][0] = recordObj[k].indexLog;
                            dayRecord[j][1] = recordObj[k].hour;
                            dayRecord[j][2] = recordObj[k].minute;
                        } else {
                            dayRecord[j].push(recordObj[k].indexLog);
                            dayRecord[j].push(recordObj[k].hour);
                            dayRecord[j].push(recordObj[k].minute);
                        }
                    }
                }
            }
        }
    }
    for(let i =0;i<dayRecord.length;i++){
        if(dayRecord[i]){
            console.log('day: ' + i);
            let recordCount = (dayRecord[i].length)/3;
            console.log('day record(COUNT):' + recordCount);
            
            //sortTime


/*             for(let a =0;a<recordCount;a++){
                let temp = new Array(3);
                if(dayRecord[i][(a*3)+1] > dayRecord[i][((a+1)*3)+1]){
                    console.log(dayRecord[i][(a*3)+1]);
                    console.log(dayRecord[i][((a+1)*3)+1])

                }
            } */

            for(let j=0;j<recordCount;j++){
                console.log(dayRecord[i][(j*3)+1] + ':' + dayRecord[i][(j*3)+2]);
            }
        }
    }
}

const year = '2018';
const month = '05';
const teacherId = 2;

const filePath = year + month + '.TXT';
//get plain records
const recordObj = getRecordFromTxtFile(filePath);

addRecord(recordObj,{
    indexLog: "_0001",
    teacherId: 2,
    year: 2018,
    month: 5,
    day: 18,
    hour: 7,
    minute: 30
});

addRecord(recordObj,{
    indexLog: "_0002",
    teacherId: 2,
    year: 2018,
    month: 5,
    day: 31,
    hour: 12,
    minute: 0
});

addRecord(recordObj,{
    indexLog: '_0003',
    teacherId: 2,
    year: 2018,
    month: 5,
    day: 31,
    hour: 13,
    minute: 0
});

deleteRecord(recordObj, {
    indexLog: '_0003'
})


//console.log(typeof record[2580]);

const dayContainer = checkforInvalidRecords(recordObj,
    {
        teacherId: teacherId,
        year: year,
        month: month
    });

calculateSalary({
    teacherId: 2,
    year: year,
    month: month
    }, recordObj,dayContainer);




//console.log(record);

//addRecord();
//deleteRecord();
//display();
