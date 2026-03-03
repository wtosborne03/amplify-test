import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { processProfilePhoto } from "../functions/process-profile-photo/resource";
const schema = a.schema({
  User: a.model({
    id: a.string().required(),
    name: a.string().required(),
    email: a.string().required(),
    bio: a.string(),
    avatar: a.string(),
  }).authorization(allow => [allow.guest()]),

  Connection: a.model({
    id: a.string().required(),
    requesterID: a.string().required(),
    receiverID: a.string().required(),
    status: a.enum(['PENDING', 'ACCEPTED', 'REJECTED'])
  }).authorization(allow => [allow.guest()]),

  // Profile photo upload mutation
  uploadProfilePhoto: a.query()
    .arguments({
      image: a.string().required(), // base64 encoded image
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(processProfilePhoto)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
