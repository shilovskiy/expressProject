# expressProject
 API, используя express
 
PUT /newuser/oleg/123

PUT /newuser/oleg1/1234

PUT /newuser/oleg2/1235

GET /readusers

POST /updateusers/oleg/134

DELETE /deluser/oleg2

RPC /rpc { "method":"new","name":"firstUser","score":"98"}

{ "method":"new","name":"2User","score":"9"}

{ "method":"get"}

{ "method":"del","name":"firstUser"}

{ "method":"modify","name":"2User","score":"200"}

можно использовать парамеры limit fields offset
