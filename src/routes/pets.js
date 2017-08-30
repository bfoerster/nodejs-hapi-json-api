const Joi = require('joi');
const _ = require('underscore');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

const opts = {
    attributes: ['id', 'name', 'category']
};
const serializer = new JSONAPISerializer('pets', opts);
const deserializer = new JSONAPIDeserializer(opts);

const allPets = [];

module.exports = [
    {
        method: 'GET',
        path: '/pets',

        config: {
            handler: (request, reply) => {
                const response = serializer.serialize(allPets);
                return reply(response);
            },
            description: 'Get All Pets',
            notes: 'Returns a list including all pets available',
            tags: ['api']
        }
    },
    {
        method: 'GET',
        path: '/pets/{id}',

        config: {
            handler: (request, reply) => {
                const id = request.params.id;
                const response = serializer.serialize(createPet(id, 'Bodo', 'Dackel'));
                return reply(response);
            },
            description: 'Get A Pet By Id',
            notes: 'Returns a single pet',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string()
                        .required()
                        .description('The pets id'),
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/pets',

        config: {
            handler: (request, reply) => {
                const body = request.payload;

                deserializer.deserialize(body).then((pet) => {
                    allPets.push(pet);
                    const response = serializer.serialize(pet);
                    return reply(response);
                });
            },
            description: 'POST a new Pet',
            notes: 'Creates a new pet',
            tags: ['api']
        }
    }
];


function createPet(id, name, category) {
    const pet = {
        id: id,
        name: name,
        category: category
    };
    return pet;
}