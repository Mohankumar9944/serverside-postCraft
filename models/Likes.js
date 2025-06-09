const defineLikes = (sequelize, DataTypes) => {
    const Likes=sequelize.define("Likes");
    return Likes;
}
export default defineLikes;