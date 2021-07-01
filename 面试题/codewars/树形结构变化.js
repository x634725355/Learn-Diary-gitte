let arr = [
  { id: 0, name: '0-1' },
  { id: 1, name: '1-1' },
  { id: 2, name: '0-1-1', parentId: 0 },
  { id: 3, name: '0-1-2', parentId: 0 },
  { id: 4, name: '0-1-1-1', parentId: 2 },
  { id: 5, name: '1-1-1', parentId: 1 }
]

let arr1 = [
  {
    id: 0,
    name: '0-1',
    children: [
      { id: 2, name: '0-1-1', parentId: 0, children: [{ id: 4, name: '0-1-1-1', parentId: 2 }] },
      { id: 3, name: '0-1-2', parentId: 0 }
    ]
  },
  {
    id: 1, name: '1-1', children: { id: 5, name: '1-1-1', parentId: 1 }
  }
]

let category = {}
arr.forEach(p => {
    let length = p.name.length;
    if (!category[length]) { category[length] = [] }
    category[length].push(p);
});

console.log('过滤数组',category);

function momo(data) {
    
}
