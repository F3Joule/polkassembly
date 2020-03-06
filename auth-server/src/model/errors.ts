// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ValidationError, NotFoundError } from 'objection';
import {
	DBError,
	UniqueViolationError,
	NotNullViolationError,
	ForeignKeyViolationError,
	CheckViolationError,
	DataError
} from 'objection-db-errors';

// In this example `res` is an express response object.
export default function errorHandler (err, res) {
	console.log(err && err.stack);
	if (err instanceof ValidationError) {
		switch (err.type) {
		case 'ModelValidation':
			res.status(400).send({
				data: err.data,
				message: err.message,
				type: 'ModelValidation'
			});
			break;
		case 'RelationExpression':
			res.status(400).send({
				message: err.message,
				type: 'InvalidRelationExpression',
				data: {}
			});
			break;
		case 'UnallowedRelation':
			res.status(400).send({
				message: err.message,
				type: 'UnallowedRelation',
				data: {}
			});
			break;
		case 'InvalidGraph':
			res.status(400).send({
				message: err.message,
				type: 'InvalidGraph',
				data: {}
			});
			break;
		default:
			res.status(400).send({
				message: err.message,
				type: 'UnknownValidationError',
				data: {}
			});
			break;
		}
	} else if (err instanceof NotFoundError) {
		res.status(404).send({
			message: err.message,
			data: {},
			type: 'NotFound'
		});
	} else if (err instanceof UniqueViolationError) {
		res.status(409).send({
			message: err.message,
			type: 'UniqueViolation',
			data: {
				columns: err.columns,
				constraint: err.constraint,
				table: err.table
			}
		});
	} else if (err instanceof NotNullViolationError) {
		res.status(400).send({
			message: err.message,
			type: 'NotNullViolation',
			data: {
				column: err.column,
				table: err.table
			}
		});
	} else if (err instanceof ForeignKeyViolationError) {
		res.status(409).send({
			message: err.message,
			type: 'ForeignKeyViolation',
			data: {
				table: err.table,
				constraint: err.constraint
			}
		});
	} else if (err instanceof CheckViolationError) {
		res.status(400).send({
			message: err.message,
			type: 'CheckViolation',
			data: {
				table: err.table,
				constraint: err.constraint
			}
		});
	} else if (err instanceof DataError) {
		res.status(400).send({
			message: err.message,
			type: 'InvalidData',
			data: {}
		});
	} else if (err instanceof DBError) {
		res.status(500).send({
			message: err.message,
			type: 'UnknownDatabaseError',
			data: {}
		});
	} else {
		res.status(500).send({
			message: err.message,
			type: 'UnknownError',
			data: {}
		});
	}
}

