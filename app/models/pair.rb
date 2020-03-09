require "forwardable"

class Pair
  include Comparable
  extend Forwardable

  attr_reader :members

  def_delegators :combined_id, :<=>

  def initialize(eng1, eng2)
    @members = [eng1, eng2]
  end

  private

  def combined_id
    @combined_id ||= members.map(&:id).map(&:to_s).sort.join("-")
  end
end