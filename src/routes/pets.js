const Joi = require('joi');
const _ = require('underscore');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const opts = {
    attributes: ['id', 'name', 'category']
};
const serializer = new JSONAPISerializer('pets', opts);

module.exports = [{
    method: 'GET',
    path: '/pets',

    config: {
        handler: (request, reply) => {
            const allPets = _.range(0, 10, 1).map((id) => createPet(id, 'Bodo', 'Dackel'));
            const response = serializer.serialize({pets: allPets});
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