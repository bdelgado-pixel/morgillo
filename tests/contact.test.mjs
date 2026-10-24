import test from 'node:test';
import assert from 'node:assert/strict';
import { getContactNumbers, getContactDestination, isContactPhoneValid, contactMessage } from '../lib/contact.ts';

const numbers = getContactNumbers({phone:'994 974 243',whatsapp:'+51 994 974 243',service:'942 420 214'});
test('each consultation reaches its own area, including service page slugs', () => {
  for (const topic of ['Servicio','Servicio técnico','servicio-tecnico','mantenimiento']) assert.equal(getContactDestination(topic,numbers).number,'51942420214');
  assert.equal(getContactDestination('Repuestos',numbers).number,'51942012195');
  for (const topic of ['Tractor','Excavadora','Construcción','Maquinaria','Implementos','Otra consulta','asesoria']) assert.equal(getContactDestination(topic,numbers).number,'51994974243');
});
test('sales and service numbers remain connected to CMS settings', () => {
  const changed = getContactNumbers({phone:'911 111 111',whatsapp:'',service:'+51 922 222 222'});
  assert.equal(getContactDestination('Servicio',changed).number,'51922222222');
  assert.equal(getContactDestination('Maquinaria',changed).number,'51911111111');
  assert.equal(getContactDestination('Servicio',getContactNumbers({phone:'911111111',whatsapp:'51911111111',service:''})).number,'');
});
test('email is optional and messages preserve phone, topic and special characters', () => {
  const data={name:' Rosa Núñez ',phone:'+51 999 123 456',email:'',topic:'Repuestos',message:'Filtro M108S & aceite\n¿Tienen stock?'};
  const message=contactMessage(data);
  assert.ok(!message.includes('Correo:'));
  assert.match(message,/Área: Repuestos/);
  assert.match(message,/Teléfono: \+51 999 123 456/);
  assert.ok(message.includes(data.message));
  assert.equal(decodeURIComponent(encodeURIComponent(message)),message);
  assert.match(contactMessage({...data,email:' rosa@example.com '}),/Correo: rosa@example.com/);
});
test('phone validation rejects missing, malformed and overlong numbers', () => {
  for(const value of ['999 123 456','+51 999 123 456','(042) 123456'])assert.equal(isContactPhoneValid(value),true);
  for(const value of ['', '123','abcdefghi','999hello123456','1234567890123456'])assert.equal(isContactPhoneValid(value),false);
});
