module.exports = (app:any) => {
    app.get("/", (req:any, res:any) => {
        res.status(200).send("Welcome attandancemanagement");
    });

    app.use("/attendance", require("./attendence"));

    app.use("/user", require("./user"));

}