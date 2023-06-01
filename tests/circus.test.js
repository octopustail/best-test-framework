describe('circus test', ()=>{
    it('works', ()=>{
        expect(true).toBe(false);
    });
});

describe('second circus test', ()=>{
    it(`dosen't work`, ()=>{
        expect(true).toBe(true);
    });
})

describe('an async circus test', ()=>{
    it(`doen't work`, async ()=>{
        await new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 1000);
        });
        expect(2).toBe(2);
    });
})

const banana = require('../js/banana.js');

it('fruit taste', ()=>{
    expect(banana).toBe('good');
})

const apple = require('../js/apple.js');

it('fruit taste', ()=>{
    expect(apple).toBe('delicious');
})