const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://localhost:27017/Blog', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model('Post', postSchema);

app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('home', { posts: posts });
    } catch (err) {
        res.send(err);
    }
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });
    try {
        await post.save();
        res.redirect('/');
    } catch (err) {
        res.send(err);
    }
});

app.get('/posts/:postId', async (req, res) => {
    const requestedPostId = req.params.postId;
    try {
        const post = await Post.findOne({ _id: requestedPostId });
        res.render('post', { title: post.title, content: post.content });
    } catch (err) {
        res.send(err);
    }
});

app.delete('/posts/:postId', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.redirect('/');
    } catch (err) {
        res.send(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
