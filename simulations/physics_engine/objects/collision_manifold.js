class CollisionManifold{
  constructor(fixture_1, fixture_2, location, normal, penetration){
    this.fixture_1 = fixture_1;
    this.fixture_2 = fixture_2;
    this.location = location;
    this.normal = normal;
    this.penetration = penetration;
  }
}
