require "forwardable"

class Pair
  include Comparable
  extend Forwardable

  attr_reader :members

  def_delegators :@members, :<=>

  def initialize(eng1, eng2)
    @members = [eng1, eng2].sort_by(&:id)
  end

  def ==(other)
    other.members.map(&:id) == members.map(&:id)
  end
end