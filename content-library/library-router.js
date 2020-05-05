const router = require('express').Router();
const db = require('./library-model');
const restricted = require('../auth/restricted');

router.get('/', restricted, (req, res) => {
    db.get()
        .then(content_library => {
            res.status(200).json(content_library)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/', restricted, async (req, res) => {
    try {
        let favorite = req.body;
        const [ newFavorite ] = await db.add(favorite);
        res.status(201).json({ newFavorite});
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.put('/:id', restricted, async (req, res) => {
    try {
        const id = req.params.id;
        const favorite = req.body;
        const updatedFavorite = await db.update(favorite, id);
        res.status(201).json({ updatedFavorite });
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.delete('/:id', restricted, async (req, res) => {
    try {
        const favoriteId = req.params.id;
        const deletedContent = await db.deleteFavorite(favoriteId);
        if(deletedContent > 0){
            res.status(204).send();
        } else {
            console.log(deletedContent)
            res.status(404).json({ message: "Selection cannot be found." });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
})



module.exports = router;