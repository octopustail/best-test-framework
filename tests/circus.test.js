describe('circus test', ()=>{
    it('works', ()=>{
        expect(true).toBe(false);
    });
});

describe('second circus test', ()=>{
    it(`dosen't work`, ()=>{
        expect(true).toBe(false);
    });
})

// describe('an async circus test', ()=>{
//     it(`doen't work`, async ()=>{
//         await new Promise((resolve, reject)=>{
//             setTimeout(()=>{
//                 resolve();
//             }, 1000);
//         });
//         expect(1).toBe(2);
//     });
// })