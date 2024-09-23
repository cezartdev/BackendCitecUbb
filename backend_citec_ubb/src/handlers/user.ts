import User from "../models/User.model"

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await User.create(name, email, password);
        res.status(200).json({ msg: "Usuario creado correctamente" });
    } catch (err) {
        res.status(500).json({ msg: "Erreor al crear el usuario" });
    }
};