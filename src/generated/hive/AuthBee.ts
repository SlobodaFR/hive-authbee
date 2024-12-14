// Original file: proto/authbee.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ValidateVerifyTokenRequest as _hive_ValidateVerifyTokenRequest, ValidateVerifyTokenRequest__Output as _hive_ValidateVerifyTokenRequest__Output } from '../hive/ValidateVerifyTokenRequest';
import type { ValidateVerifyTokenResponse as _hive_ValidateVerifyTokenResponse, ValidateVerifyTokenResponse__Output as _hive_ValidateVerifyTokenResponse__Output } from '../hive/ValidateVerifyTokenResponse';
import type { VerifyTokenRequest as _hive_VerifyTokenRequest, VerifyTokenRequest__Output as _hive_VerifyTokenRequest__Output } from '../hive/VerifyTokenRequest';
import type { VerifyTokenResponse as _hive_VerifyTokenResponse, VerifyTokenResponse__Output as _hive_VerifyTokenResponse__Output } from '../hive/VerifyTokenResponse';

export interface AuthBeeClient extends grpc.Client {
  GetVerifyToken(argument: _hive_VerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  GetVerifyToken(argument: _hive_VerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  GetVerifyToken(argument: _hive_VerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  GetVerifyToken(argument: _hive_VerifyTokenRequest, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  getVerifyToken(argument: _hive_VerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  getVerifyToken(argument: _hive_VerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  getVerifyToken(argument: _hive_VerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  getVerifyToken(argument: _hive_VerifyTokenRequest, callback: grpc.requestCallback<_hive_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  
  ValidateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  ValidateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  ValidateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  ValidateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  validateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  validateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  validateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  validateVerifyToken(argument: _hive_ValidateVerifyTokenRequest, callback: grpc.requestCallback<_hive_ValidateVerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthBeeHandlers extends grpc.UntypedServiceImplementation {
  GetVerifyToken: grpc.handleUnaryCall<_hive_VerifyTokenRequest__Output, _hive_VerifyTokenResponse>;
  
  ValidateVerifyToken: grpc.handleUnaryCall<_hive_ValidateVerifyTokenRequest__Output, _hive_ValidateVerifyTokenResponse>;
  
}

export interface AuthBeeDefinition extends grpc.ServiceDefinition {
  GetVerifyToken: MethodDefinition<_hive_VerifyTokenRequest, _hive_VerifyTokenResponse, _hive_VerifyTokenRequest__Output, _hive_VerifyTokenResponse__Output>
  ValidateVerifyToken: MethodDefinition<_hive_ValidateVerifyTokenRequest, _hive_ValidateVerifyTokenResponse, _hive_ValidateVerifyTokenRequest__Output, _hive_ValidateVerifyTokenResponse__Output>
}
