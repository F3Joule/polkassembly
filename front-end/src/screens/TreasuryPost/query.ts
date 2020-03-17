// Copyright 2019-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';
import { commentFields } from '../../fragments/comments';
import { postReactionFields } from '../../fragments/postReactions';

const onchainLinkTreasuryProposal = gql`
    fragment onchainLinkTreasuryProposal on onchain_links {
        id,
        proposer_address,
        onchain_treasury_proposal_id,
        onchain_motion_id,
        onchain_treasury_spend_proposal(where: {}) {
            id
            beneficiary
            value
            bond
            treasuryStatus(last: 1) {
                id
                status
            }
        }
    }
`;

const treasuryProposalPost = gql`
    fragment treasuryProposalPost on posts {
        author {
            id
            name
            username
        }
        content
        created_at
        id
        updated_at
        comments(order_by: {created_at: asc}) {
            ...commentFields
        }
        onchain_link{
            ...onchainLinkTreasuryProposal
        }
        title
        topic {
            id
            name
        }
        type {
            id
            name
        }
        post_reactions {
            ...postReactionFields
        }
    }
    ${commentFields}
    ${postReactionFields}
    ${onchainLinkTreasuryProposal}
`;

export const QUERY_TREASURY_PROPOSAL_POST_AND_COMMENTS = gql`
    query TreasuryProposalPostAndComments ($id:Int!) {
        posts(where: {onchain_link: {onchain_treasury_proposal_id: {_eq: $id}}}) {
            ...treasuryProposalPost
        }
    }
    ${treasuryProposalPost}
`;

