def test_api_is_running(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Todo API is running"


def test_create_todo(client):
    response = client.post("/todos", json={"title": "Test Todo", "priority": "high", "category": "work"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["priority"] == "high"
    assert data["completed"] == False


def test_get_all_todos(client):
    client.post("/todos", json={"title": "Todo 1", "priority": "low", "category": "personal"})
    client.post("/todos", json={"title": "Todo 2", "priority": "high", "category": "work"})
    response = client.get("/todos")
    assert response.status_code == 200
    assert response.json()["total"] == 2


def test_update_todo(client):
    create = client.post("/todos", json={"title": "Old Title", "priority": "low", "category": "personal"})
    todo_id = create.json()["id"]
    response = client.put(f"/todos/{todo_id}", json={"title": "New Title"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


def test_toggle_todo(client):
    create = client.post("/todos", json={"title": "Toggle Test", "priority": "medium", "category": "work"})
    todo_id = create.json()["id"]
    response = client.patch(f"/todos/{todo_id}/toggle")
    assert response.status_code == 200
    assert response.json()["completed"] == True


def test_delete_todo(client):
    create = client.post("/todos", json={"title": "Delete Me", "priority": "low", "category": "personal"})
    todo_id = create.json()["id"]
    response = client.delete(f"/todos/{todo_id}")
    assert response.status_code == 200
    get = client.get(f"/todos/{todo_id}")
    assert get.status_code == 404


def test_invalid_data_returns_error(client):
    response = client.post("/todos", json={"title": ""})
    assert response.status_code == 422


def test_stats_are_correct(client):
    client.post("/todos", json={"title": "Todo 1", "priority": "low", "category": "personal"})
    create = client.post("/todos", json={"title": "Todo 2", "priority": "high", "category": "work"})
    client.patch(f"/todos/{create.json()['id']}/toggle")
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert data["completed"] == 1
    assert data["active"] == 1
