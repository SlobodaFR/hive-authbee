import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AuthBeeClient as _hive_AuthBeeClient, AuthBeeDefinition as _hive_AuthBeeDefinition } from './hive/AuthBee';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  hive: {
    AuthBee: SubtypeConstructor<typeof grpc.Client, _hive_AuthBeeClient> & { service: _hive_AuthBeeDefinition }
    ValidateVerifyTokenRequest: MessageTypeDefinition
    ValidateVerifyTokenResponse: MessageTypeDefinition
    VerifyTokenRequest: MessageTypeDefinition
    VerifyTokenResponse: MessageTypeDefinition
  }
}

