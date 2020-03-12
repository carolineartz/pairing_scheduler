require "forwardable"

# This is a value object that represents a pair of engineers since there is no identity associated with
# the combination of two engineers, the pair of those engineers should be equal to the pair of the same
# engineers.
#
# See Pairing for how instances of pairs are stored.
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