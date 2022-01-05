const arr = [
    {
        id : 1,
        name : "cat"
    },
    {
        id : 2,
        name : "bat"
    },
    {
        id : 3,
        name : "mat"
    }
]

const index = arr.map(arr => arr.id).indexOf(3)
console.log(index)