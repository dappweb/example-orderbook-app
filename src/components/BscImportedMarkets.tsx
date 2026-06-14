'use client'

import type { BscGame } from '@/services/bscMarketManager'

type BscImportedMarketsProps = {
  readonly game: BscGame
}

export default function BscImportedMarkets({ game }: BscImportedMarketsProps) {
  const [home, away] = game.participants

  return (
    <div className="max-w-[800px] mx-auto mt-12 space-y-6">
      <div className="bg-[#FFFFFF0D] p-4 rounded-xl">
        <div className="font-semibold text-base mb-4">
          Imported BSC Testnet Event
          <span className="text-[12px] text-appGray-600 font-normal ml-2">
            Conditions pending
          </span>
        </div>
        <div className="flex gap-6 flex-col sm:flex-row">
          {[home, away].map((participant, index) => (
            <button
              key={`${game.gameId}-${participant?.name || index}`}
              className="flex flex-col p-4 transition rounded-3xl w-full disabled:cursor-not-allowed disabled:opacity-70 bg-appGray-100"
              disabled
            >
              <div className="flex justify-between w-full">
                <div className="font-semibold text-base">
                  {participant?.name || `Outcome ${index + 1}`}
                </div>
                <p
                  className={
                    index === 0
                      ? 'font-medium rounded-full font-bold text-xl text-button-LightGreen'
                      : 'font-medium rounded-full font-bold text-xl text-button-red'
                  }
                >
                  --
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-[#FFFFFF0D] px-4 py-3 text-[13px] text-appGray-600">
          This event has been imported into the BSC Testnet feed. Betting stays
          disabled until matching on-chain conditions and outcomes are created
          for this game.
        </div>
      </div>
    </div>
  )
}
