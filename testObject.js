let record = [
    {
    logIndex: '1001',
    teacherId: 2,
    year:2018,
    month:5,
    day:12,
    hour:5,
    minute:15,
    timeInhour: 5.25,
    },
    {
        logIndex: '2001',
        teacherId: 2,
        year:2018,
        month:5,
        day:12,
        hour:17,
        minute:50,
        timeInhour: 17.5,
    },
];

record.push({
    logIndex: '3001',
    teacherId: 2,
    year:2018,
    month: 5,
    hour: 7,
    minute:30,
    timeInhour: 7.5
})


record = record.sort(function(a,b){
    return a.timeInhour > b.timeInhour ? 1 : -1;
});

console.log(record.length);

for(let i =0;i<record.length;i++){
    console.log(record[i].logIndex);
}

console.log(record);