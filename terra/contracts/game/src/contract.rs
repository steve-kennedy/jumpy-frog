#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{InstantiateMsg, MigrateMsg, QueryMsg, ScoreResponse, ExecuteMsg};
use crate::state::{State, STORAGE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:game";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(
    _deps: DepsMut, 
    _env: Env, 
    _msg: MigrateMsg
) -> StdResult<Response> {

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {

    let state = State {
        owner: info.sender.clone(),
        scores: vec![],
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STORAGE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("scores", "".to_string())
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {

    match msg {
        ExecuteMsg::UpsertScore { score } => try_upsert_score(deps, info, score),
        ExecuteMsg::AddScore { score } => add_score(deps, info, score),
        ExecuteMsg::ResetScores { } => reset_scores(deps, info),
    }
}

fn try_upsert_score(
    deps: DepsMut,
    info: MessageInfo,
    score: u16,
) -> Result<Response, ContractError> {
    let mut state = STORAGE.load(deps.storage)?;
    let sender = info.sender.clone();
    let scores = &mut state.scores;
    let index = scores.iter().position(|(s, _)| s == &sender);
    match index {
        Some(i) => {
            if scores[i].1 < score {
                scores[i].1 = score;
            }
        },
        None => {
            scores.push((sender.clone(), score));
            scores.sort_by(|a, b| b.cmp(a));
        }
    }
    STORAGE.save(deps.storage, &state)?;
    Ok(Response::new()
        .add_attribute("method", "upsert")
        .add_attribute("player", info.sender)
        .add_attribute("score", score.to_string())
    )
}

fn add_score(
    deps: DepsMut,
    info: MessageInfo,
    score: u16,
) -> Result<Response, ContractError> {
    let mut state = STORAGE.load(deps.storage)?;
    let sender = info.sender.clone();
    let scores = &mut state.scores;
    scores.push((sender.clone(), score));
    scores.sort_by(|a, b| b.cmp(a));
    STORAGE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "add")
        .add_attribute("player", info.sender)
        .add_attribute("score", score.to_string())
    )
}

fn reset_scores(
    deps: DepsMut,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    let state = State {
        owner: info.sender.clone(),
        scores: vec![],
    };
    STORAGE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "reset"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetScores {} => to_binary(&query_scores(deps)?),
    }
}

fn query_scores(deps: Deps) -> StdResult<ScoreResponse> {
    let state = STORAGE.load(deps.storage)?;
    Ok(ScoreResponse { scores: state.scores })
}