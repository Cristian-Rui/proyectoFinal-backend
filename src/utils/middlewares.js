const idValidation = (req, res, next) => {
    const { id } = req.params;

    if (!productList.some(u => u.id === id)) {
        return res.status(404).send({message: 'product not found'});
    };

    next()
};

export default idValidation;