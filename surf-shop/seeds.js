const faker = require('faker');
const Post = require('./models/post');

async function seedPosts(){
    await Post.remove({});
    for(const i of new Array(40)){
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: { '_id' : '5c9fc8f704233c24e0601479', 
                      'username' : 'ian'
                    },
            price: faker.commerce.price()
            
        }
        await Post.create(post);
    }
    console.log('40 new posts created');
}
module.exports = seedPosts;

