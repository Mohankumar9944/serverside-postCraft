const defineUsers = (sequelize, DataTypes) => {
    const Users=sequelize.define("Users",{
        username:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type:DataTypes.STRING,
            allowNull: false,
        },

    });
    return Users;
}
export default defineUsers;