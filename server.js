const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const processHierarchy = require("./utils/hierarchyProcessor");
app.use(express.json());
app.post("/bfhl", (req, res) => {
    const result = processHierarchy(req.body.data);
    res.json(result);

});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});