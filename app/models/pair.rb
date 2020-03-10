require "forwardable"

class Pair
  include Comparable
  extend Forwardable

  attr_reader :members

  def_delegators :@combined_id, :<=>

  def initialize(eng1, eng2)
    @members = [eng1, eng2]
    @combined_id = @members.map(&:id).map(&:to_s).sort.join("-")
  end

  def eql?(other)
    other == self
  end
end