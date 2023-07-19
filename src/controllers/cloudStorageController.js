import asyncHandler from 'express-async-handler';
import MegaList from '../models/megalistModel.js';

export const addMegaList = asyncHandler(async (req, res) => {

    const { name, type, size, link } = req.body;

    const item = await MegaList.findOne({ link });

    if (item) {
        res.status(200);
        const data = await MegaList.find({});
        return res.send({ status: "alreadysuccess", data: data, message: "Link already exist" });
    }

    if (name && type && size && link) {
        await MegaList.create({
            name,
            type,
            size,
            link,
            popularity: 1
        });
        MegaList.find({}, (err, result) => {
            if (err) {
                return console.log(err)
            } else {
                res.status(200);
                return res.send({ status: "addsuccess", message: "Added successfully", data: result });
            }
        });
    }
});

export const getMegaList = asyncHandler(async (req, res) => {

    MegaList.find({}, (err, result) => {
        if (err) {
            return console.log(err)
        } else {
            return res.send({ status: "success", message: "Got successfully", data: result });
        }
    });
});


export const deleteMegaFile = asyncHandler(async (req, res) => {
    const { id } = req.body;
    console.log(id, "XXX")
    try {
        await MegaList.findByIdAndDelete(id);
        const data = await MegaList.find({});
        res.status(200);
        return res.json({ data: data, status: "success", message: 'Deleted successfully' });
    } catch (err) {
        console.log(err); // Or any other way you want to handle the error
        res.status(500);
        return res.json({ status: "failed", message: 'An error occurred while deleting' });
    }
});

export const editMegaFile = asyncHandler ( async ( req, res ) => {
    
    const { id, name } = req.body;

    try {
        await MegaList.findOneAndUpdate({ _id: id}, { name: name });
        const data = await MegaList.find({});
        res.status(200);
        return res.send({ data: data, status: "success", message: "Updated file name" })
    } catch (err) {
        console.log(err)
        res.status(500);
        return res.send({ status: "failed", message: "An error occurred while updating file name" })
    }

});
