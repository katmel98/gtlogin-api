import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as  _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const data = this.reflector.get('data', context.getHandler());
    if ( !data ) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.headers.user;
    console.log('*** LLAMADA DESDE EL ROLE_GUARD ***');

    const hasPermission = () => {
      if ( user.permissions ) {
        // SI EXISTEN LOS PERMISOS ATACHADOS AL USUARIO
        let permissions = user.permissions.slice();
        permissions = _.orderBy(permissions, ['effect'], ['desc']);
        const result = permissions.find(
          (obj) => {
              if ( obj.resource === '*') {
                console.log('SE APLICA PARA TODOS LOS RECURSOS');
                if ( obj.method === data['method'] ) {
                  console.log('APLICA SOLO PARA EL METODO ', data['method']);
                  console.log(obj);
                  return obj;
                } else if ( obj.method === '*' ) {
                  console.log('APLICA SOLO PARA TODOS LOS METODOS (1)');
                  console.log(obj);
                  return obj;
                }
              }
              if ( obj.method === '*' ) {
                console.log('APLICA SOLO PARA TODOS LOS METODOS (2)');
                if ( obj.resource === data['resource'] ){
                  console.log('APLICA SOLO PARA EL RECURSO ', data['resource']);
                  console.log(obj);
                  return obj;
                }
              }
              if ( obj.resource === data['resource'] && obj.method === data['method']) {
                console.log('APLICA SOLO PARA UN RECURSO ESPECIFICO');
                console.log(obj);
                return obj;
              }
          },
        );

        if ( result.effect === 'allow' ) {
          return true;
        } else {
          return false;
        }
      } else {
        // SI NO EXISTEN LOS PERMISOS ATACHADOS AL USUARIO
        return false;
      }
    };

    return user && hasPermission();

  }
}