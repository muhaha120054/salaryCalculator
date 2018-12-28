

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
};

export {getRecordFromTxtFile};