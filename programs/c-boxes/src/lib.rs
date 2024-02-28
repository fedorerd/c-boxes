use anchor_lang::{
    prelude::*,
    solana_program::{
        program::invoke_signed,
        instruction::{AccountMeta, Instruction}
    }
};
use mpl_bubblegum::{
    instructions::VerifyLeafCpiBuilder,
    programs::{MPL_BUBBLEGUM_ID, SPL_ACCOUNT_COMPRESSION_ID},
    utils::get_asset_id,
    types::LeafSchema
};

declare_id!("CBoxNpgGfdEjBNdtGE9WrvZWevadyzviGz7anY2fxm6M");

#[program]
pub mod c_boxes {

    use super::*;

    pub fn execute<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, Execute<'info>>,
        data: ExecuteData
    ) -> Result<()> {

        let box_proofs: Vec<(&AccountInfo, bool, bool)> = ctx.remaining_accounts
        .iter()
        .take(data.box_proofs_length.into())
        .map(|acc| (acc, acc.is_writable, acc.is_signer))
        .collect();

        let box_asset_id = get_asset_id(ctx.accounts.box_merkle_tree.key, data.box_nonce);

        let leaf_hash = LeafSchema::V1 {
            creator_hash: data.box_creator_hash,
            data_hash: data.box_data_hash,
            owner: ctx.accounts.box_owner.key(),
            delegate: ctx.accounts.box_owner.key(),
            nonce: data.box_nonce,
            id: box_asset_id
        }
        .hash();

        VerifyLeafCpiBuilder::new(&ctx.accounts.mpl_bubblegum)
        .merkle_tree(&ctx.accounts.box_merkle_tree)
        .root(data.box_root)
        .leaf(leaf_hash)
        .index(data.box_index)
        .add_remaining_accounts(&box_proofs)
        .invoke()?;

        let target_account_infos: Vec<AccountInfo> = ctx.remaining_accounts
        .iter()
        .skip(data.box_proofs_length.into())
        .map(|acc| acc.to_account_info())
        .collect();

        let target_account_metas = target_account_infos
        .iter()
        .map(|acc| AccountMeta {
            pubkey: acc.key(),
            is_signer: acc.key == ctx.accounts.box_signer.key || acc.is_signer,
            is_writable: acc.is_writable,
        })
        .collect();

        let ix = Instruction {
            program_id: ctx.accounts.target_program.key(),
            data: data.ix_data,
            accounts: target_account_metas
        };
        let box_signer_seeds = &[box_asset_id.as_ref(), &[ctx.bumps.box_signer]];

        invoke_signed(&ix, &target_account_infos, &[&box_signer_seeds[..]])?;

        Ok(())
    }
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct ExecuteData {
    box_root: [u8; 32],
    box_data_hash: [u8; 32],
    box_creator_hash: [u8; 32],
    box_nonce: u64,
    box_index: u32,
    box_proofs_length: u8,
    ix_data: Vec<u8>
}

#[derive(Accounts)]
#[instruction(data: ExecuteData)]
pub struct Execute<'info> {
    pub box_owner: Signer<'info>,
    /// CHECK: Used in VerifyLeaf CPI & address used to retrieve asset id
    pub box_merkle_tree: UncheckedAccount<'info>,
    /// CHECK: Seeds validation is enough, could be anything
    #[account(
        seeds = [get_asset_id(box_merkle_tree.key, data.box_nonce).as_ref()],
        bump
    )]
    pub box_signer: UncheckedAccount<'info>,

    /// CHECK: Address validation is enough
    #[account(address = MPL_BUBBLEGUM_ID)]
    mpl_bubblegum: UncheckedAccount<'info>,
    /// CHECK: Address validation is enough
    #[account(address = SPL_ACCOUNT_COMPRESSION_ID)]
    spl_account_compression: UncheckedAccount<'info>,
    
    /// CHECK: Used to CPI only
    #[account(constraint = target_program.key() != ID)]
    pub target_program: UncheckedAccount<'info>,
}