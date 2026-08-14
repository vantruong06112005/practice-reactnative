import {StatusBar} from "expo-status-bar";
import {useState} from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";

export default function App() {
  // Lưu nội dung Todo đang nhập
  const [todo, setTodo] = useState("");

  // Danh sách Todo
  const [list, setList] = useState([
    {
      id: 1,
      name: "Học tiếng Anh",
      status: "Chưa hoàn thành",
    },
    {
      id: 2,
      name: "Học lập trình",
      status: "Chưa hoàn thành",
    },
    {
      id: 3,
      name: "Làm bài tập React Native",
      status: "Chưa hoàn thành",
    },
    {
      id: 4,
      name: "Học Java",
      status: "Chưa hoàn thành",
    },
    {
      id: 5,
      name: "Học SQL",
      status: "Chưa hoàn thành",
    },
    {
      id: 6,
      name: "Làm bài tập JPA",
      status: "Chưa hoàn thành",
    },
    {
      id: 7,
      name: "Ôn tập JSP",
      status: "Chưa hoàn thành",
    },
    {
      id: 8,
      name: "Học Spring Boot",
      status: "Chưa hoàn thành",
    },
    {
      id: 9,
      name: "Luyện nghe tiếng Anh",
      status: "Chưa hoàn thành",
    },
    {
      id: 10,
      name: "Làm bài tập về nhà",
      status: "Chưa hoàn thành",
    },
  ]);

  // Hàm thêm Todo
  const handleAddTodo = () => {
    // Nếu ô input rỗng thì không làm gì
    if (todo.trim() === "") {
      return;
    }

    // Tạo Todo mới
    const newTodo = {
      id: Date.now(),
      name: todo,
      status: "Chưa hoàn thành",
    };

    // Thêm Todo mới vào cuối danh sách
    setList([...list, newTodo]);
    Alert.alert("Thành công", "Đã thêm công việc!");
    // Xóa nội dung trong ô input
    setTodo("");
  };

  // Hàm thay đổi trạng thái Todo
  const handleChangeStatus = (id: number) => {
    setList(
      list.map((item) =>
        // Kiểm tra Todo hiện tại có đúng id cần thay đổi không
        item.id === id
          ? {
              // Giữ lại các thuộc tính cũ của Todo
              ...item,

              // Nếu chưa hoàn thành thì chuyển thành đã hoàn thành
              // Nếu đã hoàn thành thì chuyển lại chưa hoàn thành
              status:
                item.status === "Chưa hoàn thành"
                  ? "Đã hoàn thành"
                  : "Chưa hoàn thành",
            }
          : item,
      ),
    );
  };

  // Hàm xóa Todo theo id
  const handleDeleteTodo = (id: number) => {
    // filter tạo ra một mảng mới
    // Chỉ giữ lại những Todo có id khác id cần xóa
    setList(list.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Thanh trạng thái của điện thoại */}
      <StatusBar style='auto' />

      {/* Tiêu đề */}
      <Text style={styles.header}>Nguyễn Văn Trường đẹp trai</Text>

      {/* Form nhập Todo */}
      <View>
        {/* Ô nhập công việc */}
        <TextInput
          style={styles.todoInput}
          value={todo}
          onChangeText={setTodo}
          placeholder='Nhập công việc...'
        />

        {/* Nút thêm Todo */}
        <Pressable
          style={styles.button}
          accessibilityLabel='Add'
          onPress={handleAddTodo}
        >
          <Text style={styles.buttonText}>Thêm</Text>
        </Pressable>
      </View>

      {/* Danh sách Todo */}
      <FlatList
        // Dữ liệu được lấy từ mảng list
        data={list}
        // Tạo key duy nhất cho mỗi item
        // item.id là số nên chuyển thành chuỗi
        keyExtractor={(item) => item.id.toString()}
        // Quy định cách hiển thị từng Todo
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            {/* Phần Todo */}
            <Pressable
              // Style cho Todo
              style={styles.todoItem}
              // Nhấn vào Todo để thay đổi trạng thái
              onPress={() => handleChangeStatus(item.id)}
            >
              {/* Hiển thị tên Todo */}
              <Text style={styles.todoName}>{item.name}</Text>

              {/* Hiển thị trạng thái */}
              <Text
                style={[
                  // Style chung của status
                  styles.status,

                  // Nếu đã hoàn thành thì màu xanh
                  // Nếu chưa hoàn thành thì màu đỏ
                  item.status === "Đã hoàn thành"
                    ? styles.completed
                    : styles.notCompleted,
                ]}
              >
                {item.status}
              </Text>
            </Pressable>

            {/* Nút Delete */}
            <Pressable
              style={({pressed}) => [
                styles.deleteButton,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
              onPress={() => handleDeleteTodo(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Container chính
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },

  // Tiêu đề
  header: {
    backgroundColor: "#0ab621",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 20,
  },

  // Ô nhập Todo
  todoInput: {
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 20,
  },

  // Nút Thêm
  button: {
    backgroundColor: "#0ab621",
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    width: 80,
  },

  // Chữ trong nút Thêm
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  // Container chứa Todo và Delete
  itemContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },

  // Một Todo
  todoItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  // Tên Todo
  todoName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Style chung của status
  status: {
    marginTop: 5,
  },

  // Todo chưa hoàn thành
  notCompleted: {
    color: "red",
  },

  // Todo đã hoàn thành
  completed: {
    color: "green",
  },

  // Nút Delete
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },

  // Chữ Delete
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
