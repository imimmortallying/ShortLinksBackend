import request from "supertest";
import app from "../../src/app";


describe('/users', ()=> {
    it('should return 200 and an empty array', async ()=> {
        await request(app)
            .get('/users')
            .expect(200, [''])
    })
})