const { knex } = require("../db");

const createReceptionWithLignes = async (reception, lignes) => {
    console.log(reception, lignes);

    try {
        return await knex.transaction(async (trx) => {
            // Met à jour le stock (augmentation stock_reel) pour chaque ligne reçue
            for (const ligne of lignes) {
                const article = await trx("articles").where({ id: ligne.article_id }).first();
                if (!article) {
                    throw new Error(`Article avec ID ${ligne.article_id} non trouvé.`);
                }

                await trx("articles")
                    .where({ id: ligne.article_id })
                    .update({ stock_reel: article.stock_reel + ligne.qt });
            }

            // Insère la réception
            reception.dateReception = new Date();
            const [id] = await trx("receptions").insert(reception);

            // Prépare les lignes avec la clé étrangère reception_id
            const lignesToInsert = lignes.map((ligne) => ({
                reception_id: id,
                article_id: ligne.article_id,
                qt: ligne.qt,
            }));

            // Insère les lignes associées
            await trx("reception_lignes").insert(lignesToInsert);

            return id;
        });
    } catch (err) {
        console.error("❌ Erreur lors de la création de la réception avec lignes :", err);
        throw err;
    }
};

const getReceptionWithLignes = async (receptionId) => {
    try {
        // Récupérer la réception
        const reception = await knex("receptions").where({ id: receptionId }).first();
        if (!reception) {
            throw new Error(`Réception avec ID ${receptionId} non trouvée.`);
        }

        // Récupérer les lignes associées à cette réception
        const lignes = await knex("reception_lignes")
            .where({ reception_id: receptionId })
            .select("id", "article_id", "qt");

        // Retourner un objet avec la réception et ses lignes
        return {
            reception,
            lignes,
        };
    } catch (error) {
        console.error("❌ Erreur getReceptionWithLignes :", error);
        throw error;
    }
};

const getAllReceptionsWithLignes = async () => {
    try {
        // Récupérer toutes les réceptions
        const receptions = await knex("receptions").select();

        // Pour chaque réception, récupérer ses lignes
        const results = await Promise.all(
            receptions.map(async (reception) => {
                const lignes = await knex("reception_lignes")
                    .where({ reception_id: reception.id })
                    .select("id", "article_id", "qt");
                return {
                    reception,
                    lignes,
                };
            })
        );

        return results;
    } catch (error) {
        console.error("❌ Erreur getAllReceptionsWithLignes :", error);
        throw error;
    }
};

module.exports = {
    createReceptionWithLignes,
    getReceptionWithLignes,
    getAllReceptionsWithLignes
};
