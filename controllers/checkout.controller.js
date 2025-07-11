const { StatusCodes } = require("http-status-codes");
const { hotelTax } = require("../helpers/data");
const Trip = require("../models/Trip");
const Order = require("../models/Order");
const Stripe = require("stripe");

const createStripeSession = async (req,res) => {
    try {
        // Initialiser la session Stripe
        const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

        // Importer tout ce qui a été envoyé par le client
        const order = req.body.order;
        const items = req.body.items;
        const token = req.body.token;

        // Récupérer le voyage vendu dans la transaction à partir de la base de données items est un tableau d'un seul élément : items[0] qui est le voyage
        const foundTrip = await Trip.findById(items[0].id);

        // Faire la transaction via Stripe
        const session = await stripe.checkout.session.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: items.map(item => {
                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: foundTrip.title,
                        },
                        unit_ammount: foundTrip.adultPrice * items[0].adults + foundTrip.uongPrice * items[0].kids + hotelTax,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: 
                process.env.NODE_ENV === "production" 
                ? `${process.env.CLIENT_URL_PROD}/checkout-success` 
                : `${process.env.CLIENT_URL_LOCAL}/checkout-success`,
            cancel_url :
            process.env.NODE_ENV === "production" 
                ? `${process.env.CLIENT_URL_PROD}/checkout` 
                : `${process.env.CLIENT_URL_LOCAL}/checkout`,
        });

        // Normalement, l'odre doit être placé en base de donnée après la preuve de payement validée par Stripe
        // Comment le faire via un webhook ici : https://docs.stripe.com/checkout/fulfillment#create-evenet-handler
        
        // Écrire l'achat dans la base de donnée (en mode « non connecté/visiteur » et en mode connecté)
        if(!token.token){
            await Order.create({...order, email: "guest@guest.com"})
        } else {
            await Order.create(order);
        }
        // Sortir
        return res.status(StatusCodes.OK).json({ url : session.url});
        } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message});
    }
};

module.exports = { createStripeSession };