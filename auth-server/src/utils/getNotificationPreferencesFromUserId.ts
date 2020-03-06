// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Notification from '../model/Notification';
import { NotificationPreferencesType } from '../types';

const DEFAULT_NOTIFICATION_PREFERENCES = {
	postParticipated: true,
	postCreated: true,
	newProposal: false,
	ownProposal: true
};

/**
 * Get Notification Preferences from userId
 */
export default async (userId: number): Promise<NotificationPreferencesType> => {
	const notification = await Notification
		.query()
		.where('user_id', userId)
		.first();

	if (!notification) {
		return DEFAULT_NOTIFICATION_PREFERENCES;
	}

	return {
		postParticipated: notification.post_participated,
		postCreated: notification.post_created,
		newProposal: notification.new_proposal,
		ownProposal: notification.own_proposal
	};
};
