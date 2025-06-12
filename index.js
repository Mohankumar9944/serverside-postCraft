import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import definePosts from './models/Posts.js';
import { DataTypes, Sequelize } from 'sequelize';

import createPostsRouter from './routes/Posts.js';
import defineComments from './models/Comments.js';
import createCommentRouter from './routes/Comments.js';
import defineUsers from './models/Users.js';
import createUserRouter from './routes/Users.js';
import defineLikes from './models/Likes.js';
import createLikesRouter from './routes/Likes.js';

import cors from 'cors';


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
  logging: false,
});

const PORT = process.env.PORT || 3006;
const Posts = definePosts(sequelize, DataTypes);
const Comments=defineComments(sequelize, DataTypes);
const Users=defineUsers(sequelize, DataTypes);
export const Likes=defineLikes(sequelize, DataTypes);

Posts.hasMany(Comments,  { foreignKey: 'PostId', onDelete: 'CASCADE' });
Comments.belongsTo(Posts, { foreignKey: 'PostId' });
Users.hasMany(Posts, { onDelete:"CASCADE" });
Posts.belongsTo(Users, { foreignKey: 'UserId' });
Posts.hasMany(Likes, {onDelete: 'CASCADE'});
Likes.belongsTo(Posts, { foreignKey: 'PostId' });
Users.hasMany(Likes, { onDelete:"CASCADE" });
Likes.belongsTo(Users, { foreignKey: 'UserId' });

const app=express();
app.use(express.json());
app.use(cors());

//Routes
app.use('/posts', createPostsRouter(Posts));
app.use('/comments', createCommentRouter(Comments));
app.use('/auth', createUserRouter(Users));
app.use("/like", createLikesRouter(Likes));

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server Up on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to sync DB:', err);
});

